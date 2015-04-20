require 'test_helper'

class SentenceTest < ActiveSupport::TestCase

  test "add one sentence for a book" do
    book = Book.first
    hdrs_row = %w{seq chapter sentence slen note noun verb adj adv con pron punct dt other}
    data_row = [18,1,18,32,nil,9,6,1,0,6,2,1,6,2]
    sent = Hash[*hdrs_row.zip(data_row).flatten]
    assert Sentence.create_from_csv_row(book, sent), "sentence not created"
  end

end
