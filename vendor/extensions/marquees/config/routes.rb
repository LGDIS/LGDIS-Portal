Refinery::Core::Engine.routes.append do

  # Frontend routes
  namespace :marquees do
    resources :marquees, :path => '', :only => [:index, :show]
  end

  # Admin routes
  namespace :marquees, :path => '' do
    namespace :admin, :path => 'refinery' do
      resources :marquees, :except => :show do
        collection do
          post :update_positions
        end
      end
    end
  end

end
