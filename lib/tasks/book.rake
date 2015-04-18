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

end
