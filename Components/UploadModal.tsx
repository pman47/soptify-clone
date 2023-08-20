"use client";
import { useForm, FieldValues } from "react-hook-form";

import useUploadModal from "@/hooks/useUploadModal";
import { SubmitHandler } from "react-hook-form/dist/types";
import { useState } from "react";

import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const UploadModal = () => {
  const uploadModal = useUploadModal();
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    // Upload to Supabase
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error("Missing fields");
        return;
      }

      const uniqueID = uniqid();

      // Upload Song
      const { data: songData, error: songError } = await supabaseClient.storage
        .from("songs")
        .upload(`song-${values.title}-${uniqueID}.mp3`, songFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (songError) {
        setIsLoading(false);
        return toast.error("Failed song upload.");
      }

      // Upload Image
      const { data: imageData, error: imageError } =
        await supabaseClient.storage
          .from("images")
          .upload(`image-${values.title}-${uniqueID}.mp3`, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

      if (imageError) {
        setIsLoading(false);
        return toast.error("Failed image upload.");
      }

      // Insert into DB

      const { error: supabaseError } = await supabaseClient
        .from("songs")
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          image_path: imageData.path,
          song_path: songData.path,
        });

      if (supabaseError) {
        setIsLoading(false);
        return toast.error(supabaseError.message);
      }

      router.refresh();
      toast.success("Song uploaded!");
      reset();
      uploadModal.onClose();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <div>
          <Input
            id="title"
            type="text"
            disabled={isLoading}
            {...register("title", { required: true })}
            placeholder="Song Title"
          />
          {errors?.title && errors?.title?.type === "required" && (
            <div className="text-red-400 mt-1">Song title is required!</div>
          )}
        </div>
        <div>
          <Input
            id="author"
            type="text"
            disabled={isLoading}
            {...register("author", { required: true })}
            placeholder="Song Author"
          />
          {errors?.title && errors?.title?.type === "required" && (
            <div className="text-red-400 mt-1">Song author is required!</div>
          )}
        </div>
        <div>
          <div className="pb-1">Select a song file</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept="audio/*"
            {...register("song", { required: true })}
          />
          {errors?.title && errors?.title?.type === "required" && (
            <div className="text-red-400 mt-1">Please choose a song!</div>
          )}
        </div>
        <div>
          <div className="pb-1">Select an image</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register("image", { required: true })}
          />
          {errors?.title && errors?.title?.type === "required" && (
            <div className="text-red-400 mt-1">Please choose an image!</div>
          )}
        </div>
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
