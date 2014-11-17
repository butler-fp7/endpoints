class AddPublicIdToEndpoint < ActiveRecord::Migration
  def change
    add_column :endpoints, :public_id, :string, limit: 10
  end
end
