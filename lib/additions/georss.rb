# encoding: utf-8
module Georss
  class Feeds
    require 'open-uri'
    require 'date'
    attr_reader :items ,:status

#*data = [ {:id => '...', :url => 'http...' } , {...} , ... ]
    def parse(*data, count)
      @status = 0
      @items = []

      if data.present? && data.present? && data.instance_of?(Array) && count && count.size>0
        data.each do |d|
          data_id = d[:id]
          url = d[:url]
          begin
            xml = Nokogiri::XML(open(url).read)
            namespaces = xml.namespaces
            type = ""
            if namespaces.has_value?("http://www.w3.org/2005/Atom")
              type = "atom1"
              entry_nodes = xml.xpath("//xmlns:entry")
            elsif namespaces.has_value?("http://purl.org/rss/1.0/")
              type = "rss1"
              entry_nodes = xml.xpath("//xmlns:item")
            else
              node = xml.xpath("//rss")
              if node.present? && node.first["version"] == "2.0"
                type = "rss2"
                entry_nodes = xml.xpath("//channel/item")
              end
            end

            if type.present?
              entry_nodes.enum_for.with_index(1) do |entry_node, i|
                entry = Entry.new
                entry.id = data_id
                entry.url = url
                entry.type = type
                entry.entry_no = i

                if type == "atom1"
                  entry.entry_id = element(entry_node.at('./xmlns:id'))
                  entry.title = element(entry_node.at('./xmlns:title'))
                  entry.updated = datetime(element(entry_node.at('./xmlns:updated'))).presence || datetime(element(entry_node.at('./xmlns:published')))
                  entry.content = element(entry_node.at('./xmlns:content'))
                  node = entry_node.at('./xmlns:link')
                  entry.link = node['href'].strip if node.present?
                elsif type == "rss1"
                  entry.entry_id = entry_node['rdf:about']
                  entry.entry_id = entry.entry_id.strip if entry.entry_id.present?
                  entry.title = element(entry_node.at('./xmlns:title'))
                  entry.updated = datetime(element(entry_node.at('./dc:date',{'dc' => namespaces['xmlns:dc']}))) if namespaces.has_key?("xmlns:dc")
                  entry.content = element(entry_node.at('./xmlns:description'))
                  entry.link = element(entry_node.at('./xmlns:link'))
                elsif type == "rss2"
                  entry.title = element(entry_node.at('./title'))
                  entry.updated = datetime(element(entry_node.at('./pubDate')))
                  entry.content = element(entry_node.at('./description'))
                  entry.link = element(entry_node.at('./link'))
                  entry.entry_id = element(entry_node.at('./guid')) + entry.updated + entry.title.slice(0,10)
                end
                if entry.entry_id.present? && entry.title.present?
                  if namespaces.has_key?("xmlns:georss")
                    entry.point = element(entry_node.at('./georss:point',{'georss' => namespaces['xmlns:georss']}))
                    entry.line = element(entry_node.at('./georss:line',{'georss' => namespaces['xmlns:georss']}))
                    entry.polygon = element(entry_node.at('./georss:polygon',{'georss' => namespaces['xmlns:georss']}))
                  end
                  @items.push entry
                end
              end
            end
          rescue => e
            @status = 1
            message  = "xml(#{url}) parse error #{e}:#{e.message}#{e.backtrace}\n"
            Rails.logger.error(message)
          end
        end
        if @items.size!=0
          @status = 0
          @items = @items.sort { |a, b| (a.updated == b.updated) ? a.entry_no <=> b.entry_no : b.updated <=> a.updated }
          size = @items.size
          @items.slice!(count..(size-1)) if !count.zero? && count < size
        else
          @status = 2 if @status!=1
        end
      else
        @status = 3
      end
    end

    def find(url, entry_id)
      @status = 0
      @items = []

      if url.present? && entry_id.present?
        data = { :id => "find", :url => url }
        parse *[data], 0

        if @status==0
#          item = @items.find { |i| i.entry_id.start_with?(entry_id) }
          item = @items.find { |i| i.entry_id == entry_id }
          @items.clear
          if item.present?
            @items.push item
          else
            @status = 2
          end
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
      if str.present?
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
    attr_accessor :id, :url, :type, :entry_no, :entry_id, :title, :link, :content, :updated, :point, :line, :polygon
  end

end
