module Refinery
  module Marquees
    module Admin
      class MarqueesController < ::Refinery::AdminController

        crudify :'refinery/marquees/marquee', :order => "publish_date DESC"

      end
    end
  end
end
