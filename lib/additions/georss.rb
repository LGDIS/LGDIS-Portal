module Georss
  class Feeds
    require 'open-uri'
    require 'date'
    attr_reader :items ,:status

#*data = [ {:id => '...', :url => 'http...' } , {...} , ... ]
    def parse(*data, count)
      @status = 0
      @items = []

      if data && !data.empty? && data.instance_of?(Array) && count && count.size>0
        begin
          data.each do |d|
            _id = d[:id]
            _url = d[:url]
            xml = Nokogiri::XML(open(_url).read)
            entry_nodes = xml.xpath('//xmlns:entry')
            entry_nodes.each do |entry_node|
              entry = Entry.new
              entry.id = _id
              entry.url = _url
              entry.entry_id = element(entry_node.at('./xmlns:id'))
              entry.title = element(entry_node.at('./xmlns:title'))
              entry.updated = datetime(element(entry_node.at('./xmlns:updated')))
              entry.updated = datetime(element(entry_node.at('./xmlns:published'))) if entry.updated.empty?
              if !entry.entry_id.empty? && !entry.title.empty? && !entry.updated.empty?
                entry.link = element(entry_node.at('./xmlns:link'))
                entry.content = element(entry_node.at('./xmlns:content'))
                entry.point = element(entry_node.at('./georss:point',{'georss' => 'http://www.georss.org/georss'}))
                entry.line = element(entry_node.at('./georss:line',{'georss' => 'http://www.georss.org/georss'}))
                entry.polygon = element(entry_node.at('./georss:polygon',{'georss' => 'http://www.georss.org/georss'}))
                @items.push entry
              end
              break if !count.zero? && @items.size==count
            end
          end
          @status = 2 if @items.size==0
        rescue
          @status = 1
        end
        if @status == 0
          @items = @items.sort { |a,b| b.updated <=> a.updated }
          size = @items.size
          @items.slice!(count..(size-1)) if !count.zero? && count < size
        end
      else
        @status = 3
      end
    end

    def find(url, entry_id)
      @status = 0
      @items = []

      if url && entry_id
        begin
          xml = Nokogiri::XML(open(url).read)
          entry_nodes = xml.xpath('//xmlns:entry')
          entry_nodes.each do |entry_node|
            _id = element(entry_node.at('./xmlns:id'))
            if entry_id == _id
              entry = Entry.new
              entry.entry_id = _id
              entry.title = element(entry_node.at('./xmlns:title'))
              entry.updated = datetime(element(entry_node.at('./xmlns:updated')))
              entry.updated = datetime(element(entry_node.at('./xmlns:published'))) if entry.updated.empty?
              if !entry.entry_id.empty? && !entry.title.empty? && !entry.updated.empty?
                entry.link = element(entry_node.at('./xmlns:link'))
                entry.content = element(entry_node.at('./xmlns:content'))
                entry.point = element(entry_node.at('./georss:point',{'georss' => 'http://www.georss.org/georss'}))
                entry.line = element(entry_node.at('./georss:line',{'georss' => 'http://www.georss.org/georss'}))
                entry.polygon = element(entry_node.at('./georss:polygon',{'georss' => 'http://www.georss.org/georss'}))
                @items.push entry
                break
              end
            end
          end
          @status = 2 if @items.size!=1
        rescue
          @status = 1
        end
      else
        @status = 3
      end
    end

    def element(node)
      if node
        node.text.strip
      else
        ""
      end
    end

    def datetime(str)
      date = ""
      if str && !str.empty?
        begin
          date = (DateTime.parse(str).new_offset(Rational(9, 24))).strftime(::CONF['time']['formats']['jp'])
        rescue ArgumentError
          # 基本はXMLデータならparseでいけるが、他の形式が必要になったらconvert_fromに追加
          ::CONF['time']['formats']['convert_from'].each do |format|
            begin
              date = (DateTime.strptime(str, format).new_offset(Rational(9, 24))).strftime(::CONF['time']['formats']['jp'])
              break
            rescue ArgumentError
            end
          end
        end
      end
      date
    end
  end

  class Entry
    attr_accessor :id, :url, :entry_id, :title, :link, :content, :updated, :point, :line, :polygon
  end

end
