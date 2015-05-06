class AddTextPosToSentence < ActiveRecord::Migration
  def change
    add_column :sentences, :text, :text
    add_column :sentences, :pos, :text
  end
end
