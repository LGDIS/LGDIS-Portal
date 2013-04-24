module TvHelper
  def tv_feed_list(_feeds)
    colors = ::CONF['additions']['tv']['marker_color']
    markers = ''

    html = '<td>'
    html += '<table width="100%">'
    if _feeds.status != 0
      html += '<tr><td>' + ::CONF['additions']['info']['status_'+_feeds.status.to_s] + '</td></tr>'
    else
      _feeds.items.each.with_index(1) do |item, i|
        html += '<tr><td style="width: 50px">No.' + i.to_s + '</td><td><b>' + item.title + '</b></td><td align="right">' + item.updated + '</td></tr>'
        html += '<tr><td colspan="3">' + raw(item.content) + '</td></tr>'
        if i != @feed.items.size
          html += '<tr><td colspan="3"><hr /></tr>'
        end
        if item.point
          markers += '&markers=color:' + colors[i-1] + '%7Clabel:' + i.to_s + '%7C' + item.point.tr(" ", ",")
        end
      end
    end
    html += '</table>'
    html += '</td>'
    html += '<td width="420" valign="top" align="center">'
    if markers
      html += '<img src="http://maps.googleapis.com/maps/api/staticmap?size=400x360&maptype=roadmap'+ markers +'&sensor=false">'
    else
      html += '<img src="http://maps.googleapis.com/maps/api/staticmap?center=38.45,141.38&zoom=11&size=400x400&maptype=roadmap&sensor=false">'
    end
    html += '</td>'
    html
  end
end
