
const LANGUAGES = [
  {
    id: "cpp",
    label: "C++",
    monacoLang: "cpp",
    boilerplate: `#include <bits/stdc++.h>
using namespace std;

int main() {
    
    return 0;
}
`,
  },
  {
    id: "python",
    label: "Python",
    monacoLang: "python",
    boilerplate: `def main():
    pass

if __name__ == "__main__":
    main()
`,
  },
  {
    id: "java",
    label: "Java",
    monacoLang: "java",
    boilerplate: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        
    }
}
`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    monacoLang: "javascript",
    boilerplate: `function main() {
    
}

main();
`,
  },
];

export default LANGUAGES;