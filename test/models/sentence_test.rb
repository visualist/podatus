require 'test_helper'

class SentenceTest < ActiveSupport::TestCase

  test "add one sentence for a book" do
    book = Book.first
    hdrs_row = %w{seq chapter sentence slen note noun verb adj adv con pron punct dt other}

    data_row = [18,4,18,32,nil,9,6,1,0,6,2,1,6,2]
    sent = Hash[*hdrs_row.zip(data_row).flatten]
    assert Sentence.create_from_csv_row(book, sent), "sentence 4/18 not created"
    assert book.sentences.count==1, "expected 1 sentence saved to this book, so far"

    data_row = [19,1,19,32,nil,9,6,1,0,6,2,1,6,2]
    sent = Hash[*hdrs_row.zip(data_row).flatten]
    assert Sentence.create_from_csv_row(book, sent), "sentence 1/19 not created"
    assert book.sentences.count==2, "expected 2 sentences saved to this book, so far"

    data_row = [18,1,18,33,nil,9,6,1,0,6,2,1,6,2]
    sent = Hash[*hdrs_row.zip(data_row).flatten]
    assert Sentence.create_from_csv_row(book, sent), "sentence 1/18 not updated"
    s = book.sentences.where(seq: 18).first
    assert s.slen==33, "expected sentence seq=18 to be updated"
    assert book.sentences.count==2, "expected 2 sentences saved to this book, so far"

    data_row = [20,2,18,32,nil,9,6,1,0,6,2,1,6,2]
    sent = Hash[*hdrs_row.zip(data_row).flatten]
    assert Sentence.create_from_csv_row(book, sent), "sentence 2/18 not created"
    assert book.sentences.count==3, "expected 3 sentences saved to this book, total"

    s = book.sentences.where(seq: 18)
    assert s.count==1, "expected only one seq=18"
    s = book.sentences.where(sentence: 18)
    assert s.count==2, "expected two (chapter_seq) sentence=18"
  end

end
