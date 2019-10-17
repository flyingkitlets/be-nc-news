const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns a new array without mutating original array", () => {
    const input = [];
    const expected = [];
    formatDates(input);
    expect(input).to.equal(input);
    expect(formatDates(input)).to.eql(expected);
  });
  it("returns single object in array with timestamp converted into Javascript date", () => {
    const input = [{ created_at: 1471522072389 }];
    const expected = [{ created_at: new Date(1471522072389) }];
    expect(formatDates(input)).to.eql(expected);
  });
  it("Formats multiple date objects", () => {
    const input = [
      { created_at: 1471522072389 },
      { created_at: 1471522072389 },
      { created_at: 1471522072389 },
      { created_at: 1471522072389 }
    ];
    const expected = [
      { created_at: new Date(1471522072389) },
      { created_at: new Date(1471522072389) },
      { created_at: new Date(1471522072389) },
      { created_at: new Date(1471522072389) }
    ];
    expect(formatDates(input)).to.eql(expected);
  });
  it("Does not mutate original objects", () => {
    const input = [
      { created_at: 1471522072389 },
      { created_at: 1471522072389 },
      { created_at: 1471522072389 },
      { created_at: 1471522072389 }
    ];
    formatDates(input);
    expect(input[0]).to.eql({ created_at: 1471522072389 });
  });
});

describe("makeRefObj", () => {
  it("returns an empty object, when passed an empty array", () => {
    const input = [];
    const actual = makeRefObj(input, "name", "phoneNumber");
    const expected = {};
    expect(actual).to.eql(expected);
  });
  it("returns a reference object with one persons name and number when passed one person", () => {
    const person = [
      { name: "vel", phoneNumber: "01134445566", address: "Northcoders, Leeds" }
    ];
    const expected = { vel: "01134445566" };
    expect(makeRefObj(person, "name", "phoneNumber")).to.eql(expected);
  });
  it("returns a reference object of multiple people when passed an array of multiple people", () => {
    const people = [
      {
        name: "vel",
        phoneNumber: "01134445566",
        address: "Northcoders, Leeds"
      },
      {
        name: "ant",
        phoneNumber: "01612223344",
        address: "Northcoders, Manchester"
      },
      { name: "mitch", phoneNumber: "07777777777", address: null }
    ];
    const expected = {
      vel: "01134445566",
      ant: "01612223344",
      mitch: "07777777777"
    };
    expect(makeRefObj(people, "name", "phoneNumber")).to.eql(expected);
  });
  it("can accept options from user as to what the ref object should hold", () => {
    const people = [
      {
        name: "vel",
        phoneNumber: "01134445566",
        address: "Northcoders, Leeds"
      },
      {
        name: "ant",
        phoneNumber: "01612223344",
        address: "Northcoders, Manchester"
      },
      { name: "mitch", phoneNumber: "07777777777", address: null }
    ];
    const expected1 = {
      vel: "01134445566",
      ant: "01612223344",
      mitch: "07777777777"
    };
    const expected2 = {
      vel: "Northcoders, Leeds",
      ant: "Northcoders, Manchester",
      mitch: null
    };
    expect(makeRefObj(people, "name", "phoneNumber")).to.eql(expected1);
  });
});

describe("formatComments", () => {
  it("returns a new array without mutating original array", () => {
    const input = [];
    const expected = [];
    formatComments(input);
    expect(input).to.equal(input);
    expect(formatComments(input)).to.eql(expected);
  });
  it("returns a new array containing single formatted comment object", () => {
    const input = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "tickle122",
        votes: -1,
        created_at: 1468087638932
      }
    ];

    const refObjInput = [
      {
        title:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        topic: "football",
        author: "grumpy19",
        body:
          "With each click and drag of a mouse, young soccer fanatics are creating the building blocks of the advanced stats that are changing how the sport is played, watched and analyzed. Opta and Prozone are among the companies that have taken soccer stats far beyond goals and saves, into the realm of pass completion percentage, defensive touches, percentage of aerial balls won, tackle percentage and goals scored above expectation. Cameras alone can’t process all these stats. So companies employ people — mostly young, mostly male, most logging matches in their spare time as a second job — to watch matches and document every event. Their work has helped develop stats that capture the value of players who don’t score many goals, but who set them up with pinpoint passing and hustle. Teams use advanced stats to decide which players to buy and put on the pitch. And fans, whether they like it or not, read and hear more numbers than ever before about this sport that for so long bucked the sports-analytics trend.",
        created_at: 1522206238717,
        article_id: 1
      }
    ];

    const completedRef = formatComments(
      input,
      makeRefObj(refObjInput, "title", "article_id")
    );
    expect(completedRef).to.eql([ { body:
      'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
     votes: -1,
     created_at: new Date(1468087638932),
     author: 'tickle122',
     article_id: 1 },]
 );
  });
  it("returns a new array containing multiple formatted comment objects", () => {
    const input = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "tickle122",
        votes: -1,
        created_at: 1468087638932
      },
      {
        body: "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
        belongs_to: "Making sense of Redux",
        created_by: "grumpy19",
        votes: 7,
        created_at: 1478813209256
      }
    ];

    const refObjInput = [
      {
        title:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        topic: "football",
        author: "grumpy19",
        body:
          "With each click and drag of a mouse, young soccer fanatics are creating the building blocks of the advanced stats that are changing how the sport is played, watched and analyzed. Opta and Prozone are among the companies that have taken soccer stats far beyond goals and saves, into the realm of pass completion percentage, defensive touches, percentage of aerial balls won, tackle percentage and goals scored above expectation. Cameras alone can’t process all these stats. So companies employ people — mostly young, mostly male, most logging matches in their spare time as a second job — to watch matches and document every event. Their work has helped develop stats that capture the value of players who don’t score many goals, but who set them up with pinpoint passing and hustle. Teams use advanced stats to decide which players to buy and put on the pitch. And fans, whether they like it or not, read and hear more numbers than ever before about this sport that for so long bucked the sports-analytics trend.",
        created_at: 1522206238717,
        article_id: 1
      }, {
        title: "Making sense of Redux",
        topic: "coding",
        author: "jessjelly",
        body:
          "When I first started learning React, I remember reading lots of articles about the different technologies associated with it. In particular, this one article stood out. It mentions how confusing the ecosystem is, and how developers often feel they have to know ALL of the ecosystem before using React. And as someone who’s used React daily for the past 8 months or so, I can definitely say that I’m still barely scratching the surface in terms of understanding how the entire ecosystem works! But my time spent using React has given me some insight into when and why it might be appropriate to use another technology — Redux (a variant of the Flux architecture).",
        created_at: 1514093931240,
        article_id: 2
      }
    ];

    const completedRef = formatComments(
      input,
      makeRefObj(refObjInput, "title", "article_id")
    );
    expect(completedRef).to.eql([ { body:
      'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
     votes: -1,
     created_at: new Date(1468087638932),
     author: 'tickle122',
     article_id: 1 },
   { body:
      'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
     votes: 7,
     created_at: new Date(1478813209256),
     author: 'grumpy19',
     article_id: 2 } ])
  });
});
