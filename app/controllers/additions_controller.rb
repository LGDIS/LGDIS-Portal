class AdditionsController < ApplicationController

  def info
    require 'will_paginate/array'
    @id = "#{params[:id]}"
    unless ::CONF['additions']['data'].keys.include?(@id)
      error_404
    else
      urls = []
      if @id == "disaster"
        ::CONF['additions']['data'].each_key do |id|
          if ::CONF['additions']['data'][id.to_s]['type'].include?(@id)
            data = {:id => id.to_s, :url => ::CONF['additions']['data'][id.to_s]['rss'] }
            urls.push data
          end
        end
      elsif ::CONF['additions']['data'][@id]['type'].include?("info") || ( ::CONF['additions']['data'][@id]['type'].include?("georss") &&  request.mobile? )
        data = {:id => @id, :url => ::CONF['additions']['data'][@id]['rss'] }
        urls.push data
      end

      if urls.size != 0
        page_size = ::CONF['additions']['info']['page_size']
        page_size = ::CONF['additions']['info']['page_size_mobile'] if request.mobile?
        @feed = ::Georss::Feeds.new
        @feed.parse *urls, 0
        @items = @feed.items.paginate({
                                       :page => params[:page], 
                                       :per_page => page_size, 
                                       :total_entries => @feed.items.length
                                       })
      else
        unless (::CONF['additions']['data'][@id]['type'].include?("info_group") || ::CONF['additions']['data'][@id]['type'].include?("georss_group")) && request.mobile?
          error_404
        end
      end
    end
  end

  def entry
    @id = "#{params[:id]}"
    @entry_id = "#{params[:entry_id]}"
    unless ::CONF['additions']['data'].keys.include?(@id) && request.mobile?
      error_404
    else
      unless ::CONF['additions']['data'][@id]['type'].include?("disaster") || ::CONF['additions']['data'][@id]['type'].include?("info") || ::CONF['additions']['data'][@id]['type'].include?("georss")
        error_404
      else
        url = ::CONF['additions']['data'][@id]['rss']
        @feed = ::Georss::Feeds.new
        @feed.find url, @entry_id
        @item = @feed.items.first if @feed.status == 0
      end
    end
  end

  def map
    if request.mobile?
      error_404
    else
      @id = "#{params[:id]}"
      unless ::CONF['additions']['data'].keys.include?(@id)
        error_404
      else
        unless ::CONF['additions']['data'][@id]['type'].include?("map")
          error_404
        else
          if ::CONF['additions']['data'][@id]['type'].include?("georss_group")
            @items = []
            ::CONF['additions']['data'].each_key do |item_id|
              if ::CONF['additions']['data'][item_id.to_s]['type'].include?(@id)
                item = Georss.new
                item.id = item_id.to_s
                item.title = ::CONF['additions']['data'][item_id.to_s]['title']
                item.rss = ::CONF['additions']['data'][item_id.to_s]['rss']
                @items.push item
              end
            end
          end
        end
      end
    end
  end

  def help
    if request.mobile?
      error_404
    else
      @id = "#{params[:id]}"
      @item = "#{params[:item]}"
      unless ::CONF['additions']['data'].keys.include?(@id)
        error_404
      else
        if @item.empty?
          if ::CONF['additions']['data'][@id]['type'].include?("georss")
            urls = []
            data = { :id => @id, :url => ::CONF['additions']['data'][@id]['rss'] }
            urls.push data
            @feed = ::Georss::Feeds.new
            @feed.parse *urls, 0
            @items = @feed.items
          else
            error_404
          end
        else
          unless ::CONF['additions']['data'][@id]['help'].include?(@item)
            error_404
          end
        end
      end
    end
    render :layout => 'help'
  end

  def tv
    @items = Refinery::Marquees::Marquee.latest(::CONF['additions']['tv']['number_marquee'])

    @feed = ::Georss::Feeds.new
    urls = []
    ::CONF['additions']['data'].each_key do |id|
      if ::CONF['additions']['data'][id.to_s]['type'].include?("tv")
        data = {:id => id.to_s, :url => ::CONF['additions']['data'][id.to_s]['rss'] }
        urls.push data
      end
    end
    @feed.parse *urls, ::CONF['additions']['tv']['number']
    render :layout => 'tv'
  end

  class Georss
    attr_accessor :id, :title, :rss
  end

  protected
end
