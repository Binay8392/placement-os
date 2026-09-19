import { CapgeminiQuestion } from "./types";

export const JAVA_OOP_QUESTIONS: CapgeminiQuestion[] = [
  {
    id: "capg-java-01",
    category: "java-oop",
    categoryLabel: "Java & OOP",
    topic: "String Pool & Reference Equality",
    difficulty: "Easy",
    type: "output-prediction",
    title: "String Literal Pool vs Heap Object Comparison",
    question: "What will be printed when the following Java code executes?",
    language: "java",
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        String s1 = "Placement";
        String s2 = "Placement";
        String s3 = new String("Placement");

        System.out.println((s1 == s2) + " " + (s1 == s3) + " " + s1.equals(s3));
    }
}`,
    options: [
      { id: "A", text: "true true true" },
      { id: "B", text: "true false true" },
      { id: "C", text: "false false true" },
      { id: "D", text: "true false false" },
    ],
    correctAnswer: "B",
    explanation: {
      correctReason: "'s1' and 's2' are string literals, so the JVM optimizes memory by reusing the identical instance in the String Constant Pool; thus (s1 == s2) is true. 's3' is explicitly created with 'new String(...)', forcing a new distinct object on the regular heap; thus (s1 == s3) is false. '.equals()' checks character sequence equality, so s1.equals(s3) is true. Result: true false true.",
      concept: "The '==' operator in Java evaluates reference identity (memory addresses) for objects. The '.equals()' method checks semantic value equivalence.",
      takeaway: "Never use '==' to compare String values in Java; always use '.equals()'.",
      wrongOptionsAnalysis: "Option A forgets that 'new' forces a distinct heap reference; Option C fails to recognize string interning for literals.",
    },
    tags: ["Java", "String", "Memory", "String Pool"],
    estimatedTimeMinutes: 2,
  },
  {
    id: "capg-java-02",
    category: "java-oop",
    categoryLabel: "Java & OOP",
    topic: "Exception Handling & Finally Blocks",
    difficulty: "Medium",
    type: "output-prediction",
    title: "Finally Block Return Value Override",
    question: "Predict the return value of test() in the following Java program:",
    language: "java",
    codeSnippet: `public class Main {
    public static int test() {
        try {
            int x = 10 / 0;
            return 1;
        } catch (ArithmeticException e) {
            return 2;
        } finally {
            return 3;
        }
    }

    public static void main(String[] args) {
        System.out.println(test());
    }
}`,
    options: [
      { id: "A", text: "1" },
      { id: "B", text: "2" },
      { id: "C", text: "3" },
      { id: "D", text: "Uncaught ArithmeticException" },
    ],
    correctAnswer: "C",
    explanation: {
      correctReason: "An ArithmeticException occurs in the try block and is caught by the catch block, which sets up a return of 2. However, the 'finally' block ALWAYS executes before a method returns. Because 'finally' explicitly executes 'return 3;', it discards any previous return values or pending exceptions from try/catch, returning 3.",
      concept: "A return statement inside a finally block overrides any prior return statement or unhandled exception originating from try or catch blocks.",
      takeaway: "Returning inside a finally block is considered bad practice because it suppresses exceptions, but it is a classic placement assessment question.",
      wrongOptionsAnalysis: "Option B overlooks that finally runs before control leaves the method; Option D ignores the catch block.",
    },
    tags: ["Java", "Exceptions", "Finally", "Control Flow"],
    estimatedTimeMinutes: 2,
  },
  {
    id: "capg-java-03",
    category: "java-oop",
    categoryLabel: "Java & OOP",
    topic: "Method Overriding vs Method Hiding",
    difficulty: "Medium",
    type: "output-prediction",
    title: "Static Method Hiding vs Instance Method Polymorphism",
    question: "What is the output of the following Java program?",
    language: "java",
    codeSnippet: `class SuperClass {
    public static void display() {
        System.out.print("SuperStatic ");
    }
    public void print() {
        System.out.print("SuperInstance ");
    }
}

class SubClass extends SuperClass {
    public static void display() {
        System.out.print("SubStatic ");
    }
    public void print() {
        System.out.print("SubInstance ");
    }
}

public class Main {
    public static void main(String[] args) {
        SuperClass obj = new SubClass();
        obj.display();
        obj.print();
    }
}`,
    options: [
      { id: "A", text: "SuperStatic SubInstance" },
      { id: "B", text: "SubStatic SubInstance" },
      { id: "C", text: "SuperStatic SuperInstance" },
      { id: "D", text: "SubStatic SuperInstance" },
    ],
    correctAnswer: "A",
    explanation: {
      correctReason: "Static methods in Java cannot be overridden; they are 'hidden' and resolved at compile time based on the reference type (SuperClass), so 'obj.display()' calls SuperClass.display() ('SuperStatic '). Instance methods participate in dynamic method dispatch; 'obj.print()' resolves at runtime to SubClass.print() ('SubInstance '). Output: 'SuperStatic SubInstance'.",
      concept: "Static methods are bonded at compile-time (early binding). Instance methods use runtime polymorphism (virtual method table).",
      takeaway: "Static method calls on object references (obj.display()) are resolved by the compiler using the declared reference type, not the runtime object instance.",
      wrongOptionsAnalysis: "Option B mistakenly treats static methods as dynamically dispatched; Option C ignores instance method overriding.",
    },
    tags: ["Java", "OOP", "Polymorphism", "Static", "Method Hiding"],
    estimatedTimeMinutes: 3,
  },
  {
    id: "capg-java-04",
    category: "java-oop",
    categoryLabel: "Java & OOP",
    topic: "Java Collections & Concurrency",
    difficulty: "Medium",
    type: "debugging",
    title: "ConcurrentModificationException in ArrayList for-each Loop",
    question: "A developer attempts to filter an ArrayList as shown below, but the program throws ConcurrentModificationException at runtime. What causes this and what is the fix?",
    language: "java",
    codeSnippet: `List<String> skills = new ArrayList<>(Arrays.asList("Java", "Python", "Bug", "C++"));
for (String s : skills) {
    if (s.equals("Bug")) {
        skills.remove(s);
    }
}`,
    options: [
      { id: "A", text: "Arrays.asList() creates immutable lists that cannot be removed from" },
      { id: "B", text: "Modifying the list directly while iterating via an implicit Iterator alters modCount; use Iterator.remove() or list.removeIf()" },
      { id: "C", text: "ArrayList does not support String objects in for-each loops" },
      { id: "D", text: "The equals check must use == instead of .equals()" },
    ],
    correctAnswer: "B",
    explanation: {
      correctReason: "The enhanced for-each loop in Java compiles to an Iterator under the hood. When 'skills.remove(s)' is called directly on the List, the list's 'modCount' is incremented without updating the iterator's 'expectedModCount'. On the next iteration, the mismatch triggers ConcurrentModificationException. Fix: use explicit 'Iterator.remove()' or modern 'skills.removeIf(s -> s.equals(\"Bug\"))'.",
      concept: "Fail-fast iterators in java.util throw ConcurrentModificationException if the underlying collection is structurally modified during iteration through any mechanism other than the iterator's own methods.",
      takeaway: "In Java interviews, modifying a collection during a for-each loop is the #1 caught trap.",
      wrongOptionsAnalysis: "Option A is false because 'new ArrayList<>(...)' creates a mutable wrapper; Option C and D are completely false.",
    },
    tags: ["Java", "Collections", "ArrayList", "ConcurrentModificationException", "Debugging"],
    estimatedTimeMinutes: 3,
  },
  {
    id: "capg-java-05",
    category: "java-oop",
    categoryLabel: "Java & OOP",
    topic: "HashMap Contract",
    difficulty: "Hard",
    type: "debugging",
    title: "Broken equals() and hashCode() Contract in Custom Keys",
    question: "A developer uses a custom Student object as a key in a HashMap. They override 'equals(Object o)' but do NOT override 'hashCode()'. What is the bug?",
    language: "java",
    codeSnippet: `class Student {
    int id;
    String name;
    public Student(int id, String name) { this.id = id; this.name = name; }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Student)) return false;
        Student s = (Student) o;
        return this.id == s.id && Objects.equals(this.name, s.name);
    }
    // Note: hashCode() is NOT overridden!
}`,
    options: [
      { id: "A", text: "Compilation Error: Java forces classes overriding equals() to declare hashCode() as abstract" },
      { id: "B", text: "Retrieval failure: map.get(new Student(1, \"Alice\")) will return null even after putting that student, because default Object.hashCode() assigns different buckets to equal objects" },
      { id: "C", text: "HashMap throws an IllegalStateException when inserting instances of Student" },
      { id: "D", text: "The HashMap converts all keys to Strings automatically" },
    ],
    correctAnswer: "B",
    explanation: {
      correctReason: "The Java contract states: if two objects are equal according to equals(), they MUST have the same hashCode(). Without overriding hashCode(), the default Object.hashCode() derives from identity (memory address). Two equal Student objects will hash to different buckets, meaning map.get(new Student(1, \"Alice\")) looks in the wrong bucket and returns null.",
      concept: "Whenever you override equals(), you MUST override hashCode(). Hash-based collections (HashMap, HashSet) first determine bucket index via hashCode(), and only call equals() upon hash collision.",
      takeaway: "Every senior developer and placement reviewer asks about the equals() and hashCode() contract.",
      wrongOptionsAnalysis: "Option A is false (it compiles fine with a warning); Option C and D are false.",
    },
    tags: ["Java", "HashMap", "HashCode", "Equals", "Contract", "Debugging"],
    estimatedTimeMinutes: 3,
  },
  {
    id: "capg-java-06",
    category: "java-oop",
    categoryLabel: "Java & OOP",
    topic: "Abstract Classes vs Interfaces",
    difficulty: "Medium",
    type: "mcq",
    title: "Java 8+ Interface Capabilities vs Abstract Classes",
    question: "In modern Java (Java 8 and above), which capability is exclusively available to Abstract Classes and CANNOT be implemented by Interfaces?",
    options: [
      { id: "A", text: "Defining static methods" },
      { id: "B", text: "Providing method implementations with code bodies" },
      { id: "C", text: "Holding mutable instance state (non-static, non-final instance fields)" },
      { id: "D", text: "Declaring abstract methods that subclasses must implement" },
    ],
    correctAnswer: "C",
    explanation: {
      correctReason: "All fields in a Java interface are implicitly 'public static final' (constants). Interfaces cannot hold mutable instance state or instance variables. Abstract classes can declare non-static, non-final instance fields and constructors to initialize object state.",
      concept: "Java 8 introduced default and static methods in interfaces, and Java 9 introduced private interface methods. The defining difference remains instance state and single class inheritance vs multiple interface implementation.",
      takeaway: "Remember: Interfaces define contracts without instance state; Abstract classes define base templates that can maintain instance state.",
      wrongOptionsAnalysis: "Option A and B were added to interfaces in Java 8 (static and default methods); Option D is a core interface feature.",
    },
    tags: ["Java", "Interfaces", "Abstract Classes", "OOP"],
    estimatedTimeMinutes: 2,
  },
  {
    id: "capg-java-07",
    category: "java-oop",
    categoryLabel: "Java & OOP",
    topic: "Constructor Chaining & Super",
    difficulty: "Easy",
    type: "output-prediction",
    title: "Parameterized Super Constructor Invocation",
    question: "What is the console output of this code?",
    language: "java",
    codeSnippet: `class Parent {
    Parent() { System.out.print("P0 "); }
    Parent(int x) { System.out.print("P1 "); }
}

class Child extends Parent {
    Child() {
        super(10);
        System.out.print("C0 ");
    }
    Child(int y) {
        this();
        System.out.print("C1 ");
    }
}

public class Main {
    public static void main(String[] args) {
        new Child(5);
    }
}`,
    options: [
      { id: "A", text: "P0 C0 C1" },
      { id: "B", text: "P1 C0 C1" },
      { id: "C", text: "P1 C1" },
      { id: "D", text: "P0 P1 C0 C1" },
    ],
    correctAnswer: "B",
    explanation: {
      correctReason: "'new Child(5)' invokes Child(int y). Its first statement is 'this()', which calls Child(). Child() explicitly invokes 'super(10)', which calls Parent(int x) printing 'P1 '. Control returns to Child(), which prints 'C0 '. Finally, Child(int y) prints 'C1 '. Combined: 'P1 C0 C1 '.",
      concept: "Constructor chaining uses 'this()' to call another constructor in the same class, or 'super()' to call a constructor in the parent class. It must be the very first line of a constructor.",
      takeaway: "Trace constructor call chains backwards through 'this()' and 'super()' to determine execution sequence.",
      wrongOptionsAnalysis: "Option A assumes default Parent() was called; Option C omits Child(); Option D duplicates parent calls.",
    },
    tags: ["Java", "Constructors", "Inheritance", "Super", "This"],
    estimatedTimeMinutes: 2,
  },
  {
    id: "capg-java-08",
    category: "java-oop",
    categoryLabel: "Java & OOP",
    topic: "Access Modifiers & Encapsulation",
    difficulty: "Easy",
    type: "mcq",
    title: "Default (Package-Private) Access Modifier in Java",
    question: "If a class member has no access modifier specified (default access), who can access it?",
    options: [
      { id: "A", text: "Only classes within the same package" },
      { id: "B", text: "Any class in any package as long as it subclasses the containing class" },
      { id: "C", text: "Only the declaring class itself" },
      { id: "D", text: "Any class in the same module" },
    ],
    correctAnswer: "A",
    explanation: {
      correctReason: "In Java, omitting an access modifier provides 'default' (package-private) access. Members are accessible only to classes within the exact same package. Subclasses in different packages CANNOT access package-private members.",
      concept: "Access modifier hierarchy from most restrictive to least: private -> default (package-private) -> protected -> public.",
      takeaway: "Protected allows access from same package PLUS subclasses in other packages. Default strictly confines access to the same package.",
      wrongOptionsAnalysis: "Option B describes protected access; Option C describes private access; Option D describes public export within modular systems.",
    },
    tags: ["Java", "Access Modifiers", "Encapsulation", "Packages"],
    estimatedTimeMinutes: 1,
  },
];
