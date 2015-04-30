class ChaptersController < ApplicationController

  def index
    @book_id = params[:book_id]
    @book = Book.find(@book_id)
    @chapters = @book.chapters
    respond_to do |format|
      format.html
      format.json { render json: @chapters }
    end
  end

  def show
    @book_id = params[:book_id]
    @book = Book.find(@book_id)
    @chapter_id = params[:id]
    #@sentences = @book.sentences_for(@chap_id)
    respond_to do |format|
      format.html
      format.json { render json: @book.as_json(:param_chapter_id => @chapter_id) }
    end
  end

end