import { useState } from "react";

const useValidation = () => {
  const allowedExtensionsRegex = /^.*\.(doc|pdf)$/i;
  const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB

  const eventHandler = (id, val) => {
    switch (id) {

      //   accept only letters and length of character upto 30
      case "alphabet":
        if (!new RegExp(/^[a-zA-Z]{1,30}$/).test(val))
          return "Enter alphabets only";
        else {
          return "";
        }

      //   accept only letters and space in between characters
      case "alphabetsAndSpace":
        if (!new RegExp(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/).test(val))
          return "Input should contain alphabets with spaces only in between";
        else {
          return "";
        }


      // accept only number without start from zero
      case "numeric":
        if (!new RegExp(/^[1-9][0-9]*$/).test(val))
          return "Enter numbers only ";
        else {
          return "";
        }

      //  accept both letters and numeric value
      case "alphanumeric":
        if (!new RegExp(/^[0-9a-zA-Z,-]+$/).test(val))
          return "Enter characters and numbers only   ";
        else {
          return "";
        }


      // accept letters, numbers, whitespace, punctuation marks, comma and special characters
      case "address":
        if (!new RegExp(/^[a-zA-Z0-9\s,-]+$/).test(val))
          return "Enter valid address";
        else {
          return "";
        }

      // start from www/http
      case "url":
        if (
          !new RegExp(
            /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g
          ).test(val)
        )
          return "Invalid URL";
        else {
          return "";
        }

      //file validation
      case "file":
        if (!allowedExtensionsRegex.test(val) && val.size > maxSizeInBytes) {
          return "Upload documents in PDF, DOC type and file size must be 1MB. ";
        } else {
          return "";
        }


      // Validation which only accepts alphabets & commas
      case "alphabetsCommaSpace":
        if (!new RegExp(/^[A-Za-z, ]+$/).test(val))
          return "Input should contain alphabets with commas & spaces only";
        else {
          return "";
        }



      default:
        return "";
    }
  };
  return { eventHandler };
};

export default useValidation;
