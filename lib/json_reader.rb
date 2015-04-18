class JsonReader

  def initialize file
    @file = locate(file)
    @data = nil
  end

  def get
    @data = load_data if @data.nil?
    @data
  end

  private

  require 'json'

  def load_data
    begin
      File.open(@file) {|f| JSON.load f}
    rescue Exception => e
      puts "Error reading JSON data: #{e.to_s}"
      raise
    end
  end

  def locate file
    return file if File.exists?(file)
    f = "#{file}.json"
    return f if File.exists?(f)
    f = "data/#{f}"
    return f if File.exists?(f)
    raise "cannot find json file"
  end

end
