class AddPostBodyToEndpoint < ActiveRecord::Migration
  def change
    add_column :endpoints, :post_body, :text
  end
end
