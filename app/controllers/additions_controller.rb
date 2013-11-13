class AdditionsController < ApplicationController

  def info
    require 'will_paginate/array'
    @id = params[:id]
    @types = []
    unless ::CONF['additions']['data'].keys.include?(@id)
      error_404
    else
      @types = ::CONF['additions']['data'][@id]['type']
      urls = []
      if @id == "disaster"
        ::CONF['additions']['data'].each_key do |id|
          if ::CONF['additions']['data'][id.to_s]['type'].include?(@id)
            data = {:id => id.to_s, :url => ::CONF['additions']['data'][id.to_s]['rss'] }
            urls.push data
          end
        end
      elsif @types.include?("info") || ( @types.include?("georss") &&  request.mobile? )
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
        unless (@types.include?("info_group") || @types.include?("georss_group")) && request.mobile?
          error_404
        end
      end
    end
  end

  def entry
    @id = params[:id]
    @entry_id = params[:entry_id]
    @types = []
    unless ::CONF['additions']['data'].keys.include?(@id) && request.mobile?
      error_404
    else
      @types = ::CONF['additions']['data'][@id]['type']
      unless @types.include?("disaster") || @types.include?("info") || @types.include?("georss")
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
      @id = params[:id]
      @group = ""
      @types = []
      unless ::CONF['additions']['data'].keys.include?(@id)
        error_404
      else
        @types = ::CONF['additions']['data'][@id]['type']
        unless @types.include?("map")
          error_404
        else
          if @types.include?("georss_group")
            @selections = []
            ::CONF['additions']['data'].each_key do |id|
              if ::CONF['additions']['data'][id.to_s].keys.include?('group')
                if ::CONF['additions']['data'][id.to_s]['group'] == @id
                  s = Selection.new
                  s.id = id.to_s
                  s.title = ::CONF['additions']['data'][id.to_s]['title']
                  @selections.push s
                end
              end
            end
          elsif ::CONF['additions']['data'][@id].keys.include?('group')
            @group = ::CONF['additions']['data'][@id]['group']
            @selections = []
            ::CONF['additions']['data'].each_key do |id|
              if ::CONF['additions']['data'][id.to_s].keys.include?('group')
                if ::CONF['additions']['data'][id.to_s]['group'] == @group
                  s = Selection.new
                  s.id = id.to_s
                  s.title = ::CONF['additions']['data'][id.to_s]['title']
                  @selections.push s
                end
              end
            end
          end
          if @types.include?("georss")
            urls = []
            data = { :id => @id, :url => ::CONF['additions']['data'][@id]['rss'] }
            urls.push data
            @feed = ::Georss::Feeds.new
            @feed.parse *urls, 0
          end
        end
      end
    end
  end

  def help
    if request.mobile?
      error_404
    else
      @id = params[:id]
      @item = params[:item]
      unless ::CONF['additions']['data'].keys.include?(@id)
        error_404
      else
        if @item.empty?
          error_404
        else
          if ::CONF['additions']['data'][@id]['help'].include?(@item)
            render :layout => 'help'
          else
            error_404
          end
        end
      end
    end
  end

  def tv
    @menu = params[:menu]
    if @menu=="signage01" || @menu == "signage"
      @menu = "signage01"
      @latest_id = params[:latest_id]
      @latest_entry_id = params[:latest_entry_id]
      @last_id = params[:last_id]
      @last_entry_id = params[:last_entry_id]
      @last_page = params[:last_page].presence || "0"
      @last_page = @last_page.to_i
    else
      @menu = "signage00"
      @latest_id = ""
      @latest_entry_id = ""
      @last_id = ""
      @last_entry_id = ""
      @last_page = ""
    end
    @items = Refinery::Marquees::Marquee.latest(::CONF['additions']['tv']['number_marquee'])

    @feed = ::Georss::Feeds.new
    urls = []
    ::CONF['additions']['data'].each_key do |id|
      if ::CONF['additions']['data'][id.to_s]['type'].include?("tv")
        data = {:id => id.to_s, :url => ::CONF['additions']['data'][id.to_s]['rss'] }
        urls.push data
      end
    end
    @feed.parse *urls, 0

    if @menu=="signage01" && @feed.status==0
      if @latest_id.present? && @latest_entry_id.present? && @last_id.present? && @last_entry_id.present? && @last_page.present? && (@feed.items[0].id == @latest_id || @feed.items[0].entry_id == @latest_entry_id)
        index = @feed.items.index { |i| i.id == @last_id && i.entry_id == @last_entry_id }
        if index.present?
          data = @feed.items[index].content.split(/#{::CONF['additions']['tv'][@menu]['break_word']}/i)
          if @last_page==0 || data.size <= @last_page * ::CONF['additions']['tv'][@menu]['break_count']
            #next item + page clear
            index = index + 1
            index = 0 if @feed.items.size <= index
            @last_page = 0
          else
            #next page
            @last_page = @last_page + 1
          end
        else
          #latest
          index = 0
          @last_page = 0
        end
      else
        #latest
        index = 0
        @last_page = 0
      end
      item = @feed.items[index]
      @latest_id = @feed.items[0].id
      @latest_entry_id = @feed.items[0].entry_id
      @last_id = item.id
      @last_entry_id = item.entry_id
      if @last_page==0
        data = item.content.split(/#{::CONF['additions']['tv'][@menu]['break_word']}/i)
        @last_page=1 if data.size > ::CONF['additions']['tv'][@menu]['break_count']
      end

      @feed.items.clear
      @feed.items.push item
    end

    render :layout => 'tv'
  end

  class Selection
    attr_accessor :id, :title
  end

  protected
end
