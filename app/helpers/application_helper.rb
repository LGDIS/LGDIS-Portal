# encoding: UTF-8
module ApplicationHelper
  def link_to_with_image(_url, _title, _class)
    if File.extname(_url) == ".pdf"
      html = image_tag('/assets/pdf.png', :size => "16x16", :alt => "PDFファイルダウンロード", :class => "icon")
      elsif File.extname(_url) == ".doc" || File.extname(_url) == ".docx"
      html = image_tag('/assets/word.png', :size => "16x16", :alt => "WORDファイルダウンロード", :class => "icon")
    else
      html = image_tag('/assets/ex_link.png', :size => "10x10", :alt => "外部サイトへリンク")
    end
    link_to raw(h(_title) + ' ' + html), _url, {:class => _class, :target => '_blank'}
  end

  def slice_list_title(_title)
    html = ''
    length = ::CONF['pages']['home']['disp_length']
    length = ::CONF['pages']['home']['disp_length_mobile'] if request.mobile?
    if _title
      if _title.length > length
        html = _title.slice(0, length) + '...'
      else
        html = _title
      end
    end
    html
  end

  def recent_feed_list(_feeds)
    if request.mobile?
      if _feeds.status != 0
        html = '<ul><li>' + ::CONF['additions']['info']['status_'+_feeds.status.to_s] + '</li></ul>'
      else
        html = '<ul>'
        _feeds.items.each do |item|
          html += '<li>' + item.updated + '<br />' + slice_list_title(item.title) + '</li>'
        end
        html += '</ul>'
        html += '<div align="right">' + link_to(">> 一覧表示", "/info/disaster") + '</div>'
      end

    else
      if _feeds.status != 0
        html = '<div class="none">' + ::CONF['additions']['info']['status_'+_feeds.status.to_s] + '</div>'
      else
        html = '<ul class="info_list">'
        _feeds.items.each do |item|
          html += '<li>' + item.updated + ' ' + slice_list_title(item.title) + '</li>'
        end
        html += '</ul>'
      end
      html += '<div class="nl_right">' + link_to(">> 一覧", "/info/disaster", :class => "nl") + '</div>'
    end
    html
  end

  def url_with_noise(_url, _sec)
    noize = Time.now.to_i/_sec
    if _url.include?('?')
      url = _url + '&noize=' + noize.to_s
    else
      url = _url + '?noize=' + noize.to_s
    end
    url
  end
end
