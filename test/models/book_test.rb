require 'test_helper'

class BookTest < ActiveSupport::TestCase

  test "add one book" do
    count_before = Book.count
    book_attributes = {
      title: "Bad smells at the garbage dump",
      author: "Wade",
      published_year: 2015
    }
    Book.create book_attributes
    count_after = Book.count
    assert (count_before+1 == count_after), "expected Book.count to increment by 1"
  end

  test "does book has_data" do
    book = Book.where(title: "Frankenstein").first
    assert !book.nil?
    assert !book.has_data?, "surprised to find data before we start!"

    # create sentence hash
    hdrs_row = %w{seq chapter sentence slen note noun verb adj adv con pron punct dt other}
    data_row = [18,1,18,32,nil,9,6,1,0,6,2,1,6,2]
    sent = Hash[*hdrs_row.zip(data_row).flatten]
    assert Sentence.create_from_csv_row(book, sent), "sentence not created"

    assert book.has_data?, "book should have data now"
    chapters = book.chapters
    assert chapters.count==1, "book should have one chapter"
    chapter = chapters.first
    sentence = book.sentences_for(chapter)
    assert sentence.count==1, "book should have one sentence"
  end

end
