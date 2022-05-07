import { ArrowLeft } from 'phosphor-react';
import React, { useState } from 'react';
import { FeedbackType, feedbackTypes } from '..';
import { Closebutton } from '../../CloseButton';
import { ScreenshotButton } from './ScreenshotButton';

import { api } from '../../../libs/api';
import { Loading } from '../../Loading';

interface FeedbackContentStepProps {
  feedbackType: FeedbackType;
  onFeedbackRestartRequested: () => void;
  onFeedbackSet: () => void;
}

export function FeedbackContentStep({
  feedbackType,
  onFeedbackRestartRequested,
  onFeedbackSet,
}: FeedbackContentStepProps) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);

  const feedbackTypeInfo = feedbackTypes[feedbackType];

  async function handleSubmitFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSendingFeedback) return;
    setIsSendingFeedback(true);

    await api.post('/feedbacks', {
      type: feedbackType,
      comment,
      screenshot,
    });

    setIsSendingFeedback(false);
    onFeedbackSet();
  }

  return (
    <>
      <header>
        <button
          type='button'
          className='absolute top-5 left-5 text-zinc-400 hover:text-zinc-100'
          onClick={onFeedbackRestartRequested}
        >
          <ArrowLeft weight='bold' className='w-4 h-4' />
        </button>
        <span className='text-xl leading-6 flex items-center gap-2'>
          <img
            src={feedbackTypeInfo.image.source}
            alt={feedbackTypeInfo.image.alt}
            className='
            w-6
            h-6
          '
          />
          {feedbackTypeInfo.title}
        </span>
        <Closebutton />
      </header>

      <form className=' my-4 w-full' onSubmit={handleSubmitFeedback}>
        <textarea
          className='
            min-w-[304px]
            w-full
            min-h-[112px]
            text-sm
            placeholder-zinc-400
            text-zinc-100
            border
            border-zinc-600
            bg-transparent
            rounded-md
            focus:outline-none
            focus:border-brand-500
            focus:ring-brand-500
            focus:ring-1
            resize-none
            scrollbar-thin
            scrollbar-thumb-zinc-700
            scrollbar-track-transparent
          '
          placeholder='Conte com detalhes o que está acontencendo...'
          onChange={(event) => setComment(event.target.value.trim())}
        />

        <footer className='flex gap-2 mt-2'>
          <ScreenshotButton
            onScreenshotTook={setScreenshot}
            screenshot={screenshot}
          />

          <button
            type='submit'
            className='
              p-2
              bg-brand-500
              rounded-md
              border-transparent
              flex-1
              flex
              justify-center
              items-center
              text-sm
              hover:bg-brand-300
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-offset-zinc-900
              focus:ring-brand-500
              transition-colors
              disabled:opacity-50
              disabled:hover:bg-brand-500
            '
            disabled={comment.length === 0 || isSendingFeedback}
          >
            {isSendingFeedback ? <Loading /> : 'Enviar Feedback'}
          </button>
        </footer>
      </form>
    </>
  );
}
