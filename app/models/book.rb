class Book < ActiveRecord::Base
  has_many :sentences

  def self.available
    where(available: true)
  end

  def has_data?
    sentences.count > 0
  end

  def chapters
    sentences.order(:seq).pluck(:chapter).uniq
  end

  def by_chapter
    # zero-indexed
    sentences.select("chapter, max(slen) as max_sent, count(id) as num_sent")
             .group("chapter").order("seq")
  end

  def max_chapter_length
    # .. in terms of number of sentences
    by_chapter.map(&:num_sent)
  end

  def max_sentence_length
    # sql equivalent: select chapter, max(slen) as max_sent from sentences
    #                 where book_id=2 group by chapter order by seq"
    by_chapter.map(&:max_sent)
  end

  def sentences_for(chapter)
    columns = %w{seq chapter_seq chapter sentence slen note
                 noun verb adj adv con pron punct dt other}.map(&:to_sym)
    sentences.where(chapter: chapter).order(:seq).pluck(*columns)
  end

  def as_json(options = {})
    json = super(options)
    json['sentences'] = sentences_for(options[:param_chapter_id])
    json
  end
end
