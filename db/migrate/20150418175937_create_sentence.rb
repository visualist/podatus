class CreateSentence < ActiveRecord::Migration
  def change
    create_table :sentences do |t|
      # from CSV: seq,chapter,sentence,slen,note,noun,verb,adj,adv,con,pron,punct,dt,other

      t.integer :seq
      t.string :chapter
      t.integer :chapter_seq
      t.integer :sentence
      t.integer :slen
      t.text :note

      t.integer :noun
      t.integer :verb
      t.integer :adj
      t.integer :adv
      t.integer :con
      t.integer :pron
      t.integer :punct
      t.integer :dt
      t.integer :other

      t.references :book
      t.timestamps null: false
    end
  end
end
