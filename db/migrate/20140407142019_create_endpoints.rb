class CreateEndpoints < ActiveRecord::Migration
  def change
    create_table :endpoints do |t|
      t.string :name
      t.string :user_id
      t.string :url
      t.string :data_format
      t.text :description
      t.string :method
      t.text :parameters
      t.text :headers

      t.timestamps
    end
  end
end
