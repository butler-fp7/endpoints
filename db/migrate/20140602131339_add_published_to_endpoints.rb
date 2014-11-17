class AddPublishedToEndpoints < ActiveRecord::Migration
  def change
    add_column :endpoints, :published, :boolean
  end
end
