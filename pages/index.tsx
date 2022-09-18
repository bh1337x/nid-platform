import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { NidData } from '../lib/types';

const Home: NextPage = () => {
  const [nid, setNid] = useState('');
  const [dob, setDob] = useState('');
  const [nidData, setNidData] = useState<null | NidData>();
  return (
    <div>
      <Head>
        <title>NID Platform</title>
        <meta name='description' content='NID Platform - Victor Group' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='flex flex-col items-center justify-center w-full'>
        <span style={{ height: 100 }}></span>
        <h1 className='text-4xl font-bold'>NID Platform</h1>
        <div className='w-full max-w-md'>
          <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='input_nid'>
                NID Number :
              </label>
              <input
                className='
                mt-1
                block
                w-full
                rounded-md
                bg-gray-100
                border-transparent
                focus:border-gray-500 focus:bg-white focus:ring-0
              '
                id='input_nid'
                type='number'
                placeholder='ID Number'
                autoComplete='off'
                value={nid}
                onChange={e => setNid(e.target.value)}></input>
            </div>
            <div className='mb-6'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='input_dob'>
                Date Of Birth :
              </label>
              <input
                className='
                mt-1
                block
                w-full
                rounded-md
                bg-gray-100
                border-transparent
                focus:border-gray-500 focus:bg-white focus:ring-0
              '
                id='input_dob'
                type='date'
                value={dob}
                min='1900-01-01'
                max='2022-01-01'
                onChange={e => setDob(e.target.value)}></input>
            </div>
            <div className='flex items-center justify-between'>
              <button
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                onClick={e => {
                  e.preventDefault();
                  setNidData(null);
                  var loading_toast = toast.loading('Requesting NID data...');
                  fetch('/api/nid-check', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nid, dob }),
                  })
                    .then(res => res.json())
                    .then(data => {
                      if (data.error) {
                        toast.error(data.error, {
                          id: loading_toast,
                        });
                      } else {
                        setNidData(data);
                        toast.success('NID data loaded!', {
                          id: loading_toast,
                        });
                      }
                    })
                    .catch(e =>
                      toast.error(e, {
                        id: loading_toast,
                      })
                    );
                }}>
                {'      '}
                Check{'      '}
              </button>
              <button
                className='text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-10 py-2.5 text-center mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-800 dark:border-gray-700'
                onClick={e => {
                  e.preventDefault();
                  setNidData(null);
                  setNid('');
                  setDob('');
                  toast.dismiss();
                }}>
                Reset
              </button>
            </div>
          </form>
        </div>
        {nidData ? (
          <div className='max-w-md rounded overflow-hidden shadow-lg mt-3'>
            <div className='px-6 py-4'>
              <p className='text-gray-700 text-lg'>
                <strong>Holder&apos;s Name :</strong> {nidData.name_of_national}
                <br />
                <strong>Father&apos;s Name :</strong> {nidData.name_of_father}
                <br />
                <strong>Mother&apos;s Name :</strong> {nidData.name_of_mother}
                <br />
                <strong>Date Of Birth :</strong> {nidData.date_of_birth}
                <br />
                <strong>Holder&apos;s Image :</strong>
              </p>
            </div>
            <Image
              width={480}
              height={640}
              src={`${nidData.image_of_national}`}
              alt='Image of NID holder'
            />
          </div>
        ) : (
          <span></span>
        )}
      </div>
      <Toaster position='top-center' />
    </div>
  );
};

export default Home;
