class Book < ActiveRecord::Base
  has_many :sentences

  def has_data?
    sentences.count > 0
  end
end
