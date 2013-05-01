module Refinery
  module Marquees
    class Engine < Rails::Engine
      include Refinery::Engine
      isolate_namespace Refinery::Marquees

      engine_name :refinery_marquees

      initializer "register refinerycms_marquees plugin" do
        Refinery::Plugin.register do |plugin|
          plugin.name = "marquees"
          plugin.url = proc { Refinery::Core::Engine.routes.url_helpers.marquees_admin_marquees_path }
          plugin.pathname = root
          plugin.activity = {
            :class_name => :'refinery/marquees/marquee'
          }
          
        end
      end

      config.after_initialize do
        Refinery.register_extension(Refinery::Marquees)
      end
    end
  end
end
