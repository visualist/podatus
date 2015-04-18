class Book < ActiveRecord::Base
  has_many :sentences
end
