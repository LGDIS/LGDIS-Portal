module Refinery::News
  ItemsController.class_eval do

    def show
      if request.mobile?
      else
        error_404
      end
    end

    def archive
      error_404
    end

    def find_published_news_items
      page_size = ::CONF['news']['page_size']
      page_size = ::CONF['news']['page_size_mobile'] if request.mobile?
      @items = Item.published.translated.paginate :page => params[:page],
                                                  :per_page => page_size
    end
  end
end
