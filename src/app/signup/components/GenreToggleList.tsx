interface GenreToggleListProps {
  genres: string[];
  favoriteGenres: string[];
  toggleGenre: (genre: string) => void;
}

export default function GenreToggleList({
  genres,
  favoriteGenres,
  toggleGenre,
}: GenreToggleListProps) {
  return (
    <div>
      <p className="mb-2 font-semibold">선호 장르 선택</p>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button
            key={genre}
            type="button"
            onClick={() => toggleGenre(genre)}
            className={`px-3 py-1 rounded ${
              favoriteGenres.includes(genre)
                ? 'bg-green-600 text-white'
                : 'bg-gray-300'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}
