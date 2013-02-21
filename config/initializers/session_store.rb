# Be sure to restart your server when you modify this file.

LgdisPortal::Application.config.session_store :cookie_store, key: '_LGDIS_Portal_session'

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rails generate session_migration")
# LgdisPortal::Application.config.session_store :active_record_store

# To use Dalli memcached client library for Rails Session Storage.
# LgdisPortal::Application.config.session_store ActionDispatch::Session::CacheStore, :expire_after => 20.minutes
