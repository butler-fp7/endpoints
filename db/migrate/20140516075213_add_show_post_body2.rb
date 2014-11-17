class AddShowPostBody2 < ActiveRecord::Migration
  def change
  	add_column :endpoints, :show_body, :boolean, default: true
  end
end
