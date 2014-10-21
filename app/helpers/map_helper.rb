module MapHelper

  def js_for_georss_map(_feeds)
    html = ''
    if @types.include?("georss")
      html += 'putRssMarkers();' + "\n"
      if _feeds.status == 0
        _feeds.items.each do |item|
          if item.point.join.present?
            s = ''
            if item.title.present?
              s += '<div style="font-family: Arial, sans-serif; font-size: small">'
              s += '<div style="font-weight: bold; font-size: medium; margin-bottom: 0em">' + item_escape(item.title) + '</div>'
              s += '<div><p>' + item_escape(item.content) + '</p></div>' if item.content.present?
              s += '</div>'
            end
            item.point.each do |geo_point|
              #html += 'setRssMarker(' + item.point.tr(" ", ",") + ', \'' + s + '\');' + "\n"
              html += 'setRssMarker(' + geo_point.tr(" ", ",") + ', \'' + s + '\');' + "\n"
            end
          end
        end
      end
    end
    html
  end

  def item_escape(text)
    # delete CR and LF, escape Single quato
    text.gsub(/(\r\n|\r|\n)/, "").gsub(/(\')/, "&#x27;")
  end
end
