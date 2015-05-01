require 'json_reader'

def find_or_create_book attrib
  b = Book.where(attrib).first_or_create
  b.save
end


namespace :book do

  desc "find and print data"
  task :find => :environment do
    data = JsonReader.new('book').get
    puts "Book Data: #{data.inspect}"
  end

  desc "load"
  task :load => :environment do
    puts "book-count before: #{Book.count}"
    data = JsonReader.new('book').get
    books = data['books']
    books.each do |book_attributes|
      # first, remove attributes not destined for the DB
      book_attributes.delete('ckey')
      book_attributes.delete('related_data')
      find_or_create_book book_attributes
    end
    puts "book-count after: #{Book.count}"
  end

  desc "show all books in order of published_year"
  task :show => :environment do
    books = Book.all.order(:published_year)
    books.each do |book|
      puts "#{book.title} by #{book.author}, #{book.published_year}"
    end
  end

require 'csv'

  desc "load sentence data from associated CSV files"
  task :sentence => :environment do
    data = JsonReader.new('book').get
    books = data['books']
    books.select{|a| a.has_key?('related_data')}.each do |book_attr|
      book_attr.delete('ckey')
      rd = book_attr['related_data']
      book_attr.delete('related_data')
      current_book = Book.where(book_attr).first
      next if current_book.nil?
      next if current_book.available # skip loading if the book is "done"

      if rd.has_key?('sentence')
        csv_pathname = File.join(['data', rd['sentence']])
        CSV.foreach(csv_pathname, headers: true, encoding: "UTF-8") do |row|
          Sentence.create_from_csv_row(current_book, row.to_hash)
        end
      end

    end
  end

  desc "set availability flag based on having data"
  task :available => :environment do
    Book.all.each do |book|
      next if book.available == book.has_data?
      puts "#{book.title}: available is #{book.available}, has_data is #{book.has_data?}"
      book.available = book.has_data?
      book.save
    end
  end

end
