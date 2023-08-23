"use client";
import SongItem from "@/Components/SongItem";
import { Song } from "@/types";
import { FC } from "react";

interface PageContentProps {
  songs: Song[];
}

const PageContent: FC<PageContentProps> = ({ songs }) => {
  if (songs.length === 0) {
    return <div className="text-neutral-400 mt-4">No songs available!</div>;
  }
  return (
    <div
      className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-8
            gap-4
            mt-4
        "
    >
      {songs.map((song) => (
        <SongItem key={song.id} onClick={() => {}} data={song} />
      ))}
    </div>
  );
};

export default PageContent;
