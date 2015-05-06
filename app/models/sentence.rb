class Sentence < ActiveRecord::Base
  belongs_to :book #, foreign_key: "books_id"

  def pos_as_json
    # suspect paren substitution will break this when parens are part of the content
    r = eval(pos.gsub('(', '[').gsub(')', ']'))
    r.to_json
  end

  def self.create_from_csv_row book, hash
    key_attrib = {book: book, seq: hash["seq"]}
    s = self.where(key_attrib).first_or_create
    s.update_columns(hash)
  end

end
