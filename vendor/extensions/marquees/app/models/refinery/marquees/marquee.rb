module Refinery
  module Marquees
    class Marquee < Refinery::Core::BaseModel
      self.table_name = 'refinery_marquees'

      attr_accessible :title, :publish_date, :expiration_date, :position

      acts_as_indexed :fields => [:title]

      validates :title, :publish_date, :presence => true
      default_scope :order => "publish_date DESC"

      class << self
        def not_expired
          where(arel_table[:expiration_date].eq(nil).or(arel_table[:expiration_date].gt(Time.now)))
        end

        def published
          not_expired.where("publish_date < ?", Time.now)
        end

        def latest(limit = 10)
          published.limit(limit)
        end
      end
    end
  end
end
