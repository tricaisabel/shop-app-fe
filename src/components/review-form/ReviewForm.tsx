import { FC, useContext, useState } from "react";
import StarRating from "../star-rating/StarRating";
import { DispatchContext, StateContext } from "../../App";
import { Action, ActionType } from "../../store/actions";
import "./ReviewForm.css";
import {
  postReviewToProduct,
  updateReviewDescription,
} from "../../api/product";
import { IReview } from "../../store/state.interface";

const ReviewForm: FC = () => {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext) as React.Dispatch<Action>;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const title = `${
    state.reviewForm.editMode ? "Edit your" : "Add a"
  } review at ${state.product?.name}`;

  const showToastMessage = (message: string) => {
    dispatch({
      type: ActionType.SHOW_TOAST,
      payload: message,
    });

    setTimeout(() => {
      dispatch({ type: ActionType.HIDE_TOAST });
    }, 3000);
  };

  function setUserReview(review: IReview) {
    dispatch({ type: ActionType.SET_USER_REVIEW, payload: review });
  }

  function addUserReviewDescription(description: string) {
    dispatch({
      type: ActionType.SET_USER_REVIEW_DESCRIPTION,
      payload: description,
    });
  }

  function goBackToProduct() {
    dispatch({ type: ActionType.HIDE_REVIEW_FORM });
  }

  function setReviewForm(name: string, value: string | number) {
    dispatch({
      type: ActionType.SET_REVIEW_FORM,
      payload: {
        name,
        value,
      },
    });
  }

  function closeModal() {
    setIsModalOpen(false);
    goBackToProduct();
  }

  function addReview() {
    if (state.reviewForm.rating !== -1 && state.productId) {
      postReviewToProduct(
        state.productId,
        state.reviewForm,
        showToastMessage
      ).then((review) => {
        if (review) setUserReview(review);
        setIsModalOpen(true);
      });
    } else {
      showToastMessage("You must choose a star rating first");
    }
  }

  function editReview() {
    if (
      state.reviewForm.description !== "" &&
      state.userReview?._id &&
      state.productId
    ) {
      updateReviewDescription(
        state.productId,
        state.userReview?._id,
        state.reviewForm.description,
        showToastMessage
      ).then(() => {
        addUserReviewDescription(state.reviewForm.description);
        setIsModalOpen(true);
      });
    } else {
      showToastMessage("Please enter a description");
    }
  }

  function submit(event: any) {
    event.preventDefault();
    state.reviewForm.editMode ? editReview() : addReview();
  }

  function updateReviewForm(event: any) {
    const { name, value } = event.target;
    setReviewForm(name, value);
  }

  function setRating(value: number) {
    if (state.reviewForm.editMode) return undefined;
    setReviewForm("rating", value);
  }

  return (
    <>
      {state.product && state.reviewForm.show && (
        <div className="new--review--container">
          <a className="blue previous-btn" onClick={goBackToProduct}>
            <span className="previous">&#8249;</span> Reviews
          </a>

          <h1 className="center">{title}</h1>

          <div className="center">
            <StarRating
              showText={true}
              size={"big"}
              numberOfStars={state.reviewForm?.rating}
              onClick={setRating}
              disabled={state.reviewForm.editMode}
            />
          </div>

          <form onSubmit={(e) => submit(e)}>
            <label htmlFor="name">
              <b>Name</b>
            </label>
            <input
              type="text"
              placeholder="Your name"
              name="name"
              value={state.reviewForm.name}
              onChange={updateReviewForm}
              className={state.reviewForm.editMode ? "disabled" : ""}
            />

            <label htmlFor="description">
              <b>Description</b>
            </label>
            <input
              type="text"
              placeholder="Add more details on your experience"
              name="description"
              value={state.reviewForm.description}
              onChange={updateReviewForm}
            />

            <div className="add--new-review">
              <button
                className="button_primary background_blue center"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="modal--title">Thank you for your review.</h3>
            <p>You're helping others make smarter decisions every day.</p>

            <hr />
            <p className="center blue" onClick={closeModal}>
              Okay!
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewForm;
