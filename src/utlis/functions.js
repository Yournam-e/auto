export function compare(a, b) {
  var dateB = new Date(b.created);
  var dateA = new Date(a.created);

  return dateB - dateA;
}

export function checkVIN(error) {
  switch (error) {
    case 0:
      return false;
    case 1:
      return "Неверный формат! Введите VIN по типу W09XXXXXXXX501XXX английским алфавитом";
    case 2:
      return "Введенный VIN или номер заняты";
  }
}

export function checkSPZ(error) {
  switch (error) {
    case 0:
      return false;
    case 1:
      return "Неверный формат! Введите номер по типу А012АА77 кириллицей";
    case 2:
      return "Введенный VIN или номер заняты";
  }
}

export function checkAmountSpent(error) {
  switch (error) {
    case 0:
      return false;
    case 1:
      return "Не может быть меньше 0";
    case 2:
      return "Не больше 1000000000";
    case 3:
      return "Только целые числа";
  }
}
export function checkMileageTask(error) {
  switch (error) {
    case 0:
      return false;
    case 1:
      return "Не может быть меньше 0 или пустым";
    case 2:
      return "Не более 2000000км";
    case 3:
      return "Только целые числа";
  }
}

export function checkPhoto(photoType) {
  switch (photoType) {
    case "image/webp":
      return true;
    case "image/png":
      return true;
    case "image/jpeg":
      return true;
    case "image/gif":
      return true;
    case "image/jpg":
      return true;
  }

  return false;
}

export const reverse = (arr) =>
  arr.map((_, index) => arr[arr.length - 1 - index]);
