# encoding: utf-8
require "spec_helper"

describe Refinery do
  describe "Marquees" do
    describe "Admin" do
      describe "marquees" do
        login_refinery_user

        describe "marquees list" do
          before do
            FactoryGirl.create(:marquee, :title => "UniqueTitleOne")
            FactoryGirl.create(:marquee, :title => "UniqueTitleTwo")
          end

          it "shows two items" do
            visit refinery.marquees_admin_marquees_path
            page.should have_content("UniqueTitleOne")
            page.should have_content("UniqueTitleTwo")
          end
        end

        describe "create" do
          before do
            visit refinery.marquees_admin_marquees_path

            click_link "Add New Marquee"
          end

          context "valid data" do
            it "should succeed" do
              fill_in "Title", :with => "This is a test of the first string field"
              click_button "Save"

              page.should have_content("'This is a test of the first string field' was successfully added.")
              Refinery::Marquees::Marquee.count.should == 1
            end
          end

          context "invalid data" do
            it "should fail" do
              click_button "Save"

              page.should have_content("Title can't be blank")
              Refinery::Marquees::Marquee.count.should == 0
            end
          end

          context "duplicate" do
            before { FactoryGirl.create(:marquee, :title => "UniqueTitle") }

            it "should fail" do
              visit refinery.marquees_admin_marquees_path

              click_link "Add New Marquee"

              fill_in "Title", :with => "UniqueTitle"
              click_button "Save"

              page.should have_content("There were problems")
              Refinery::Marquees::Marquee.count.should == 1
            end
          end

        end

        describe "edit" do
          before { FactoryGirl.create(:marquee, :title => "A title") }

          it "should succeed" do
            visit refinery.marquees_admin_marquees_path

            within ".actions" do
              click_link "Edit this marquee"
            end

            fill_in "Title", :with => "A different title"
            click_button "Save"

            page.should have_content("'A different title' was successfully updated.")
            page.should have_no_content("A title")
          end
        end

        describe "destroy" do
          before { FactoryGirl.create(:marquee, :title => "UniqueTitleOne") }

          it "should succeed" do
            visit refinery.marquees_admin_marquees_path

            click_link "Remove this marquee forever"

            page.should have_content("'UniqueTitleOne' was successfully removed.")
            Refinery::Marquees::Marquee.count.should == 0
          end
        end

      end
    end
  end
end
