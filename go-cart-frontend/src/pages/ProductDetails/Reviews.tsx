import GradiantText from "@/components/GradiantText";
import { Button, LoadingButton } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddReview,
  useDeleteReview,
  useEditReview,
  useReviews,
} from "@/hooks/useReview";
import { formatDate } from "@/lib/utils";
import { Review } from "@/types/review.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthStore } from "@/store/authStore";
import AuthDialog from "../Auth/AuthDialog";

function Reviews({ productId }: { productId: string }) {
  return (
    <div className="h-full w-full">
      <h1 className="text-2xl font-semibold">
        All <GradiantText text="Reviews." size="2xl" />
      </h1>

      <AddReview productId={productId} />
      <ReviewsList productId={productId} />
    </div>
  );
}

const formSchema = z.object({
  comment: z
    .string()
    .min(2, "Review must be of atleat of 2 characters.")
    .max(200, "Review can't be more than 200 characters."),
  rating: z.number().min(1, "Rating is required."),
});

export type AddReviewFormValues = z.infer<typeof formSchema>;

function AddReview({ productId }: { productId: string }) {
  const { isAuthenticated } = useAuthStore();
  const [hovered, setHovered] = useState<number | null>(null);
  const { mutate: addReview, isPending } = useAddReview(productId);

  const form = useForm<AddReviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
      rating: 0,
    },
  });

  function onSumbit(data: AddReviewFormValues) {
    // console.log(data, "ADDING_REVIEW");
    addReview(data);
    form.reset();
    setHovered(null);
  }

  return (
    <div className="w-full py-4 flex items-center gap-2">
      <Form {...form}>
        <form
          className="w-full flex items-center gap-2 justify-between"
          onSubmit={form.handleSubmit(onSumbit)}
        >
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2 *:cursor-pointer">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          fill={
                            (hovered ?? field.value) >= i ? "yellow" : "gray"
                          }
                          className={
                            (hovered ?? field.value) >= i
                              ? "text-yellow-200"
                              : "text-gray-400"
                          }
                          onMouseEnter={() => setHovered(i)}
                          onMouseLeave={() => setHovered(null)}
                          onClick={() => field.onChange(i)}
                        />
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="w-[70vw] md:w-[85vw] shadow-none"
                      {...field}
                      placeholder="Type your review here."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isAuthenticated() && (
            <Button
              disabled={isPending}
              type="submit"
              className="cursor-pointer"
            >
              Submit
            </Button>
          )}
        </form>
      </Form>
      {!isAuthenticated() && (
        <AuthDialog>
          <Button type="button" className="cursor-pointer">
            Submit
          </Button>
        </AuthDialog>
      )}
    </div>
  );
}

function ReviewsList({ productId }: { productId: string }) {
  const { data, isPending } = useReviews(productId);
  const { user } = useAuthStore();

  if (isPending) {
    return <p className="text-muted-foreground mt-4">Loading reviews</p>;
  }

  const reviews: Review[] = data?.data?.reviews || [];

  return (
    <div className="h-full w-full">
      {reviews.length === 0 ? (
        <p className="mt-4 text-muted-foreground">No reviews yet.</p>
      ) : (
        <div className="flex flex-col gap-4 mt-4 border-t">
          {reviews.map((review) => (
            <div key={review.id} className=" p-4 rounded-lg border-b">
              <div className="w-full flex md:items-center flex-col md:flex-row justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm md:font-semibold">
                    User ID: {review.user_id}
                  </p>
                  <span className="text-xs">
                    {formatDate(review.created_at)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1 my-2 text-yellow-600 mt-2 md:mt-0">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        fill={i < review.rating ? "yellow" : "gray"}
                        key={i}
                        className={
                          i < review.rating
                            ? "text-yellow-200"
                            : "text-gray-400"
                        }
                      />
                    ))}
                  </div>

                  {user?.id === review.user_id && (
                    <div className="flex items-center gap-2 justify-end mt-1 *:cursor-pointer">
                      <EditReviewDialog
                        data={review}
                        productId={productId}
                        reviewId={review.id}
                      />
                      <DeleteReviewDialog
                        productId={productId}
                        reviewId={review.id}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-lg text-foreground">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DeleteReviewDialog({
  productId,
  reviewId,
}: {
  productId: string;
  reviewId: string;
}) {
  const { mutate: deleteReview, isPending } = useDeleteReview(
    productId,
    reviewId
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Trash2 className="text-red-600" size={18} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            review.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>
            <LoadingButton
              onClick={() => deleteReview()}
              text="Continue"
              loadingText="Deleting"
              isLoading={isPending}
            />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function EditReviewDialog({
  productId,
  reviewId,
  data,
}: {
  productId: string;
  reviewId: string;
  data: AddReviewFormValues;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const { mutate: editReview, isPending } = useEditReview(productId, reviewId);

  const form = useForm<AddReviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: data.comment,
      rating: data.rating,
    },
  });

  useEffect(() => {
    form.reset(data);
  }, [data, form]);

  function onSumbit(data: AddReviewFormValues) {
    // console.log(data, "EDITING_REVIEW");
    editReview(data);
    setHovered(null);
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Pencil size={18} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogDescription>
            <div className="w-full py-4">
              <Form {...form}>
                <form className="w-full" onSubmit={form.handleSubmit(onSumbit)}>
                  <div className="flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center gap-2 *:cursor-pointer">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                  key={i}
                                  fill={
                                    (hovered ?? field.value) >= i
                                      ? "yellow"
                                      : "gray"
                                  }
                                  className={
                                    (hovered ?? field.value) >= i
                                      ? "text-yellow-200"
                                      : "text-gray-400"
                                  }
                                  onMouseEnter={() => setHovered(i)}
                                  onMouseLeave={() => setHovered(null)}
                                  onClick={() => field.onChange(i)}
                                />
                              ))}
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              className="shadow-none"
                              {...field}
                              placeholder="Type your review here."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogClose asChild>
                    <LoadingButton
                      isLoading={isPending}
                      text="Save"
                      loadingText="Saving"
                      type="submit"
                      className="cursor-pointer mt-2"
                    />
                  </DialogClose>
                </form>
              </Form>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default Reviews;
