class AddBookAvailable < ActiveRecord::Migration
  def change
    add_column :books, :available, :boolean, default: true
  end
end
