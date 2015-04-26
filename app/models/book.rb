class Book < ActiveRecord::Base
  has_many :sentences

  def has_data?
    sentences.count > 0
  end

  def chapters
    sentences.order(:seq).pluck(:chapter).uniq
  end

  def sentences_for(chapter)
    columns = %w{seq chapter_seq chapter sentence slen note
                 noun verb adj adv con pron punct dt other}.map(&:to_sym)
    sentences.where(chapter: chapter).order(:seq).pluck(*columns)
  end
end
