# encoding: utf-8
module TvHelper
  require 'hmac-sha1'

  def feed_list(_feeds, _menu, _page)
    googleid = ''
    googlekey = ''
    if ::CONF['googlemaps']['clientid'].present? && ::CONF['googlemaps']['signature'].present?
      googleid = '&client=' + ::CONF['googlemaps']['clientid']
      googlekey = ::CONF['googlemaps']['signature']
    elsif ::CONF['googlemaps']['apikey'].present?
      googleid = '&key=' + ::CONF['googlemaps']['apikey']
    end

    html = '<div id="slider">'
    html += '<table id="slide_contents">'
    if _feeds.status != 0
      html += '<tr><td>' + ::CONF['additions']['info']['status_'+_feeds.status.to_s] + '</td></tr>'
    else
      data = ''
      content = ''
      title = ''
      _feeds.items.each.with_index(1) do |item, i|
        title = '<b>' + item.title + '</b>'
        if _menu=="signage01" && _page != 0
          data = item.content.split(/#{::CONF['additions']['tv'][@menu]['break_word']}/i)
          content = data[(::CONF['additions']['tv'][@menu]['break_count']*(_page-1))..((::CONF['additions']['tv'][@menu]['break_count']*_page)-1)].join("<br />")
          title += ' （' + _page.to_s + '/' + (data.size.fdiv(::CONF['additions']['tv'][@menu]['break_count']).ceil).to_s + '）'
        else
          content = item.content
        end

        html += '<tr><td class="title">' + title + '</td></tr>'
        html += '<tr><td class="date">発表日時：' + item.updated + '</td></tr>'
        html += '<tr><td><br /></td></tr>'
        html += '<tr><td>'
        html += '<table><tr>'
        html += '<td valign="top">' + raw(content) + '</td>'
        if item.point.join.present?
          geo_points = ''
          item.point.each do |geo_point|
            Rails.logger.info(geo_point.tr(" ", ","))
            geo_points += '&markers=color:red%7C' + geo_point.tr(" ", ",")
          end
          url = 'http://maps.googleapis.com/maps/api/staticmap?size=300x200&zoom=14&maptype=roadmap' + geo_points + '&sensor=false' + googleid
          html += '<td class="map" valign="top"><img src="' + signURL(url, googlekey) + '"></td>'
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

  def signURL(url, privateKey)
    if privateKey.present?
      parsedURL = URI.parse(url)
      urlToSign = parsedURL.path + '?' + parsedURL.query

      # Decode the private key
      rawKey = Base64.decode64(privateKey.tr('-_','+/'))

      # create a signature using the private key and the URL
      sha1 = HMAC::SHA1.new(rawKey)
      sha1 << urlToSign
      rawSignature = sha1.digest()

      # encode the signature into base64 for url use form.
      signature =  Base64.encode64(rawSignature).tr('+/','-_')

      # prepend the server and append the signature.
      signedUrl = parsedURL.scheme + '://' + parsedURL.host + urlToSign + '&signature=' + signature
      signedUrl
    else
      url
    end
  end

  def refresh_tag(_feeds, _menu, _latest_id, _latest_entry_id, _last_id, _last_entry_id, _last_page)
    if _menu=="signage01"
      html = '<meta http-equiv="refresh" content="' + ::CONF['additions']['tv'][@menu]['refresh_page'].to_s + '; url=/' + _menu
      if _feeds.status==0
        html += '/' + URI.escape( _latest_id, Regexp.new("[^#{URI::PATTERN::ALNUM}]") )
        html += '/' + URI.escape( _latest_entry_id, Regexp.new("[^#{URI::PATTERN::ALNUM}]") )
        html += '/' + URI.escape( _last_id, Regexp.new("[^#{URI::PATTERN::ALNUM}]") )
        html += '/' + URI.escape( _last_entry_id, Regexp.new("[^#{URI::PATTERN::ALNUM}]") )
        html += '/' + _last_page.to_s
      end
      html += '/">'
    else
      html = '<meta http-equiv="refresh" content="' + ::CONF['additions']['tv']['refresh_page'].to_s + '; url=/' + _menu + '/' + Time.now.to_i.to_s + '/">'
    end
    html
  end
end
