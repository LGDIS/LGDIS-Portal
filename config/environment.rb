# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
Portal::Application.initialize!

CONF = YAML.load(File.read("#{Rails.root}/config/config.yml"))
