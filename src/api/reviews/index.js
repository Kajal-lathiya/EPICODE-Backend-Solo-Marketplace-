import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { getReviews, writeReviews } from "../../lib/fs-tools.js";
import {
  checkReviewSchema,
  triggerBadRequest
} from "../products/validators.js";

const { NotFound } = httpErrors;

const reviewRouter = express.Router();

reviewRouter.post(
  "/:productId/reviews",
  checkReviewSchema,
  triggerBadRequest,
  async (req, res, next) => {
    // create review
    try {
      const newReview = { ...req.body, createdAt: new Date(), _id: uniqid() };
      const reviewArray = await getReviews();
      reviewArray.push(newReview);
      await writeReviews(reviewArray);
      res.status(201).send({ _id: newReview._id });
    } catch (error) {
      next(error);
    }
  }
);

reviewRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const reviewArray = await getReviews();
    res.send(reviewArray);
  } catch (error) {
    next(error);
  }
});

reviewRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    const review = reviews.find(
      (review) => review._id === req.params.reviewId
    );
    if (review) {
      res.send(review);
    } else {
      next(NotFound(`Product id ${req.params.productId} not found!`));
    }

    res.send("call success");
  } catch (error) {
    next(error);
  }
});

reviewRouter.put("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    const index = reviews.findIndex(
      (review) => review._id === req.params.reviewId
    );
    if (index !== -1) {
      const oldReview = reviews[index];
      const updatedReview = {
        ...oldReview,
        ...req.body,
        updatedAt: new Date()
      };
      reviews[index] = updatedReview;
      await writeReviews(reviews);
      res.send(updatedReview);
    } else {
      next(NotFound(`Product id ${req.params.productId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

reviewRouter.delete("/:productId/reviews/:reviewId", async (req, res, next) => {
  // delete product review
  try {
    const reviews = await getReviews();
    const remainingreviews = reviews.filter(
      (review) => review._id !== req.params.reviewId
    );
    if (reviews.length !== remainingreviews.length) {
      await writeReviews(remainingreviews);
      res.status(204).send();
    } else {
      next(NotFound(`Review id ${req.params.reviewId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default reviewRouter;
