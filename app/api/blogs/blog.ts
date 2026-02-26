await db.insert(activities).values({
  title,
  date,
  year,
  category,
  shortDescription,
  fullContent,
  imageUrl: uploadUrl, // The state from the widget
  videoLink,
  photoAlbumLink,
});
