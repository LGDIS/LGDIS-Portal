class CreateMarqueesMarquees < ActiveRecord::Migration

  def up
    create_table :refinery_marquees do |t|
      t.string :title
      t.datetime :publish_date
      t.datetime :expiration_date
      t.integer :position

      t.timestamps
    end

  end

  def down
    if defined?(::Refinery::UserPlugin)
      ::Refinery::UserPlugin.destroy_all({:name => "refinerycms-marquees"})
    end

    if defined?(::Refinery::Page)
      ::Refinery::Page.delete_all({:link_url => "/marquees/marquees"})
    end

    drop_table :refinery_marquees

  end

end
