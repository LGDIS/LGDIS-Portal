# encoding: utf-8
module TvHelper
  def tv_feed_list(_feeds)
    keys = ''
    if ::CONF['googlemaps']['clientid'].present? && ::CONF['googlemaps']['signature'].present?
      keys = '&client=' + ::CONF['googlemaps']['clientid'] + '&signature=' + ::CONF['googlemaps']['signature']
    elsif ::CONF['googlemaps']['apikey'].present?
      keys = '&key=' + ::CONF['googlemaps']['apikey']
    end

    html = '<div id="slider">'
    html += '<table id="slide_contents">'
    if _feeds.status != 0
      html += '<tr><td>' + ::CONF['additions']['info']['status_'+_feeds.status.to_s] + '</td></tr>'
    else
      _feeds.items.each.with_index(1) do |item, i|
        html += '<tr><td class="title"><b>' + item.title + '</b></td></tr>'
        html += '<tr><td class="date">発表日時：' + item.updated + '</td></tr>'
        html += '<tr><td><br /></td></tr>'
        html += '<tr><td>'
        html += '<table><tr>'
        html += '<td>' + raw(item.content) + '</td>'
        if item.point.present?
          html += '<td class="map"><img src="http://maps.googleapis.com/maps/api/staticmap?size=300x200&zoom=14&maptype=roadmap&markers=color:red%7C' + item.point.tr(" ", ",") + '&sensor=false' + keys + '"></td>'
        end
        html += '</tr></table>'
        html += '</td></tr>'
        if i != @feed.items.size
          html += '<tr><td><hr /></td></tr>'
        end
      end
    end
    html += '</table>'
    html += '</div>'
    html
  end
end
