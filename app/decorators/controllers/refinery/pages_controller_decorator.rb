module Refinery
  PagesController.class_eval do

    before_filter :find_recents, :only => [:home]

    protected
    def find_recents
      @feed = ::Georss::Feeds.new
      urls = []
      ::CONF['additions']['data'].each_key do |id|
        if ::CONF['additions']['data'][id.to_s]['type'].include?("disaster")
          data = {:id => id.to_s, :url => ::CONF['additions']['data'][id.to_s]['rss'] }
          urls.push data
        end
      end
      if request.mobile?
        @feed.parse *urls, ::CONF['pages']['home']['additions_number_mobile']
        @items = Refinery::News::Item.latest(::CONF['pages']['home']['news_number_mobile'])
      else
        @feed.parse *urls, ::CONF['pages']['home']['additions_number']
        @items = Refinery::News::Item.latest(::CONF['pages']['home']['news_number'])
      end
    end
  end
end
