import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Category'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method

    const categories = ["Action", "Adventure", "Anime", "Chuyển Sinh", "Cổ Đại", "Comedy", "Comic", "Demons", "Detective", "Doujinshi", "Drama", "Fantasy", "Gender Bender", "Harem", "Historical", "Horror", "Huyền Huyễn", "Isekai", "Josei", "Mafia", "Magic", "Manhua", "Manhwa", "Martial Arts", "Military", "Mystery", "Ngôn Tình", "One shot", "Psychological", "Romance", "School Life", "Sci-fi", "Seinen", "Shoujo", "Shoujo Ai", "Shounen", "Shounen Ai", "Slice of life", "Sports", "Supernatural", "Tragedy", "Trọng Sinh", "Truyện Màu", "Webtoon", "Xuyên Không"];
    for(const category of categories) {
      await Category.create({name: category})
    }
  }
}
