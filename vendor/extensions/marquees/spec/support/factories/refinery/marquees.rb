
FactoryGirl.define do
  factory :marquee, :class => Refinery::Marquees::Marquee do
    sequence(:title) { |n| "refinery#{n}" }
  end
end

